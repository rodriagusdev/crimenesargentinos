
//todo: integrar con backend
// Esto accion es la que aparece en el menu desplegable de investigacion. 
export default interface IMenuAction {
  id: "clues" | "suspects" | "arrest" | "board";
  title: string;
  description: string;
  icon: string;
  detail: string;
}
