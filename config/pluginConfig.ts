import { Microkernel } from '../plugini'
import * as helloWorldPlugin from '../examples/helloWorld'
import * as timePlugin from '../examples/timePlugin'
import * as calculatorPlugin from '../examples/calculatorPlugin'
import * as weatherPlugin from '../examples/weatherPlugin'
import * as todoPlugin from '../examples/todoPlugin'
import * as counterPlugin from '../examples/counterPlugin'

// Crear y configurar el microkernel
export const microkernel = new Microkernel()

// Registrar todos los plugins de una vez
microkernel.registerPlugins([
  helloWorldPlugin,
  timePlugin,
  calculatorPlugin,
  weatherPlugin,
  todoPlugin,
  counterPlugin
])

// Debug: mostrar plugins registrados
console.log('Plugins registrados:', microkernel.getAllPlugins().map(p => p.name))
