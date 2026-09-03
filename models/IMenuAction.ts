export default interface IMenuAction {
  id: "clues" | "suspects" | "arrest";
  title: string;
  description: string;
  icon: string;
  detail: string;
}
