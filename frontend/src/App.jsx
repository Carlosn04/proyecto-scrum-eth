import {BrowserRouter,Routes,Route,} from 'react-router-dom'
import { Home } from './Home'
import { CrearRed } from './componentes/CrearRed'
import {Lista} from './componentes/Lista'
import { CrearNodos } from './componentes/CrearNodos'

import { QueryClient, QueryClientProvider } from 'react-query'


const queryClient=new QueryClient()
export function App(){

    return (
    <QueryClientProvider client={queryClient}>


    
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home></Home>}>
                    <Route path="/crearred" element={<CrearRed></CrearRed>} ></Route>
                    <Route path="/crearnodos" element={<CrearNodos></CrearNodos>} ></Route>
                    <Route path="/" element={<Lista></Lista>} ></Route>
                   
                    
                </Route>

            </Routes>
        </BrowserRouter>
        
    </QueryClientProvider>
    )
}