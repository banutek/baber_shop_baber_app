import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import type { IGalleryDtoOut } from '../../../dto'
import {
  useGetGalleryByShopHook,
  useUploadMultipleImgHook,
  useUpdateGalleryHook,
} from '../../../hooks/gallery'
import { GalleryService } from '../../../services'
import { useShopStore, useToastStore } from '../../../stores'
import { baseUrl } from '../../../services/url'

export interface IGalleryComponentProps {
  default_props?: boolean
  default_method?: () => void
}

export const GalleryComponent: React.FC<IGalleryComponentProps> = () => {
  const { currentShop } = useShopStore()
  const addToast = useToastStore((store) => store.addToast)
  const queryClient = useQueryClient()
  const shopId = currentShop?.id ?? ''

  const { data, isLoading, isError } = useGetGalleryByShopHook(shopId)
  const { mutate: uploadImages, isPending: isUploading } = useUploadMultipleImgHook()
  const { mutate: updateImage, isPending: isUpdating } = useUpdateGalleryHook()

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [editingImage, setEditingImage] = useState<IGalleryDtoOut | null>(null)
  const [alt, setAlt] = useState('')
  const [displayOrder, setDisplayOrder] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const images = useMemo(() => data?.data.images ?? [], [data])
  const sortedImages = useMemo(
    () => [...images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [images],
  )

  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview))
  }, [previews])

  const resolveImageUrl = (url: string) =>
    url.startsWith('http') || url.startsWith('blob:') ? url : `${baseUrl}${url.replace(/^\//, '')}`

  const handleFiles = (files: FileList | null) => {
    const nextFiles = Array.from(files ?? []).filter((file) => file.type.startsWith('image/'))
    previews.forEach((preview) => URL.revokeObjectURL(preview))
    setSelectedFiles(nextFiles.slice(0, 20))
    setPreviews(nextFiles.slice(0, 20).map((file) => URL.createObjectURL(file)))
  }

  const clearSelection = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview))
    setSelectedFiles([])
    setPreviews([])
  }

  const handleUpload = () => {
    if (!shopId || selectedFiles.length === 0 || isUploading) return
    const uploadedCount = selectedFiles.length

    const formData = new FormData()
    formData.append('barberShopId', shopId)
    selectedFiles.forEach((file) => formData.append('images', file))

    uploadImages(formData, {
      onSuccess: async () => {
        clearSelection()
        await queryClient.invalidateQueries({ queryKey: ['get-gallery-by-shop', shopId] })
        addToast(`${uploadedCount} image(s) ajoutée(s) à la galerie.`, 'success')
      },
      onError: (error) => {
        console.error('[ProfileEdit] Gallery upload failed:', error)
        addToast("Erreur lors de l'ajout des images.", 'error')
      },
    })
  }

  const removePreview = (indexToRemove: number) => {
    URL.revokeObjectURL(previews[indexToRemove])
    setSelectedFiles((files) => files.filter((_, index) => index !== indexToRemove))
    setPreviews((current) => current.filter((_, index) => index !== indexToRemove))
  }

  const startEditing = (image: IGalleryDtoOut) => {
    setEditingImage(image)
    setAlt(image.alt ?? '')
    setDisplayOrder(image.displayOrder?.toString() ?? '')
  }

  const cancelEditing = () => {
    setEditingImage(null)
    setAlt('')
    setDisplayOrder('')
  }

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingImage || isUpdating) return

    const formData = new FormData()
    formData.append('alt', alt)
    if (displayOrder !== '') formData.append('displayOrder', displayOrder)

    updateImage(
      { galleryId: editingImage.id, datas: formData },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ['get-gallery-by-shop', shopId] })
          cancelEditing()
          addToast('Image mise à jour.', 'success')
        },
        onError: (error) => {
          console.error('[ProfileEdit] Gallery update failed:', error)
          addToast('Erreur lors de la mise à jour de l’image.', 'error')
        },
      },
    )
  }

  const handleDelete = async (image: IGalleryDtoOut) => {
    if (deletingId) return
    setDeletingId(image.id)
    try {
      await GalleryService.delete_gallery(image.id)
      await queryClient.invalidateQueries({ queryKey: ['get-gallery-by-shop', shopId] })
      addToast('Image supprimée.', 'success')
    } catch (error) {
      console.error('[ProfileEdit] Gallery delete failed:', error)
      addToast('Erreur lors de la suppression de l’image.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <fieldset className="rounded-xl border border-gray-200 p-4">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
          🖼️ Galerie du salon
        </legend>

        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-4 py-7 text-center transition hover:border-amber-500 hover:bg-amber-50/40">
          <span className="text-2xl">📷</span>
          <span className="mt-2 text-sm font-semibold text-gray-800">Ajouter des photos</span>
          <span className="mt-1 text-xs text-gray-500">Jusqu’à 20 images à la fois</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="sr-only"
            disabled={isUploading}
            onChange={(event) => handleFiles(event.target.files)}
          />
        </label>

        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {previews.map((preview, index) => (
              <div
                key={`${selectedFiles[index].name}-${index}`}
                className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <img src={preview} alt="" className="aspect-square h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow"
                  aria-label={`Retirer ${selectedFiles[index].name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!shopId || selectedFiles.length === 0 || isUploading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading
            ? 'Ajout en cours...'
            : `Ajouter ${selectedFiles.length || ''} image${selectedFiles.length > 1 ? 's' : ''}`}
        </button>

        <div className="mt-5 border-t border-gray-100 pt-4">
          {isLoading && <p className="text-sm text-gray-500">Chargement de la galerie...</p>}
          {isError && <p className="text-sm text-red-600">Impossible de charger la galerie.</p>}
          {!isLoading && !isError && sortedImages.length === 0 && (
            <p className="rounded-lg bg-gray-50 py-6 text-center text-sm text-gray-500">
              Aucune image dans la galerie.
            </p>
          )}

          {sortedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {sortedImages.map((image) => (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <img
                    src={resolveImageUrl(image.url)}
                    alt={image.alt ?? ''}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="flex items-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => startEditing(image)}
                      className="flex-1 rounded-md bg-gray-100 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(image)}
                      disabled={deletingId === image.id}
                      className="rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {editingImage && (
          <div className="mt-5 rounded-xl bg-gray-50 p-4">
            <form onSubmit={handleUpdate}>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Modifier l’image</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-gray-500">
                  Texte alternatif
                  <input
                    value={alt}
                    onChange={(event) => setAlt(event.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-gray-500">
                  Ordre d’affichage
                  <input
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(event) => setDisplayOrder(event.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </fieldset>
    </div>
  )
}
