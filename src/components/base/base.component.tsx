import type React from 'react'
// import { useNavigate } from 'react-router-dom'

export interface IComponentPageProps {
  default_props?: boolean
  default_method?: () => void
}

export const ComponentPage: React.FC<IComponentPageProps> = () => {
  // const navigate = useNavigate()
  return (
    <div>
      hello world from base component
      {/* <div onClick={() => navigate('/')}>Go to home</div> */}
    </div>
  )
}

// const StyledDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
//   '& .MuiPaper-root': {
//     backgroundColor: theme.palette.background.paper,
//   },
// }));
