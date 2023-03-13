import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import { Home } from './Home'
import { CrearRed } from './componentes/CrearRed'
import { Lista } from './componentes/Lista'
import { Nodos } from './componentes/Nodos'

import { QueryClient, QueryClientProvider } from 'react-query'
import { Faucet } from './componentes/Faucet'
import { Transactions } from './componentes/Transacciones'


const queryClient = new QueryClient()
export function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home></Home>}>
                        <Route path="/crearred" element={<CrearRed></CrearRed>} ></Route>
                        <Route path="/:id" element={<Nodos></Nodos>} ></Route>
                        <Route path="/" element={<Lista ></Lista>} ></Route>
                        <Route path="/faucet" element={<Faucet></Faucet>}></Route>
                        <Route path="/transacciones" element={<Transactions></Transactions>}></Route>

                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}