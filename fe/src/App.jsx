import { Routes, Route } from 'react-router-dom'
import ProjectDetail from './ProjectDetail'
import ProjectList from './ProjectList'

function App () {
  return (
    <Routes>
      <Route path='/' element={<ProjectList />} />
      <Route path='/detail/:projectId' element={<ProjectDetail />} />
    </Routes>
  )
}

export default App
