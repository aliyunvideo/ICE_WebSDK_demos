import { Routes, Route } from 'react-router-dom'
import ProjectDetail from './ProjectDetail'
import ProjectList from './ProjectList'
import ProjectDetailTemplate from './ProjectDetailTemplate'

function App () {
  return (
    <Routes>
      <Route path='/' element={<ProjectList />} />
      <Route path='/detail/:projectId' element={<ProjectDetail />} />
      <Route path='/template/:projectId' element={<ProjectDetailTemplate />} />
    </Routes>
  )
}

export default App
