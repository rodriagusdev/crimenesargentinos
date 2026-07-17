// components/login/RegisterForm.tsx
// Define qué propiedades recibe el componente
type RegisterFormProps = {
  onBackClick: () => void;
};

export default function RegisterForm({ onBackClick }: RegisterFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yellow-500 font-['Press_Start_2P'] text-lg text-center mb-2">REGISTRO</h2>
      
      <div className="flex flex-col gap-1">
        <label className="text-white font-['Press_Start_2P'] text-[10px]">Nombre de Usuario</label>
        <input className="bg-[#DED29C] p-2 border-2 border-[#8B7355] text-black font-['Press_Start_2P'] text-sm" placeholder="usuario" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-white font-['Press_Start_2P'] text-[10px]">Gmail</label>
        <input className="bg-[#DED29C] p-2 border-2 border-[#8B7355] text-black font-['Press_Start_2P'] text-sm" placeholder="ejemplo@gmail.com" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-white font-['Press_Start_2P'] text-[10px]">Contraseña</label>
        <input type="password" className="bg-[#DED29C] p-2 border-2 border-[#8B7355] text-black font-['Press_Start_2P'] text-sm" placeholder="******" />
      </div>

      <button className="bg-[#2D3E4E] text-white p-3 font-['Press_Start_2P'] mt-4 border-2 border-black hover:bg-[#3d5266]">
        CREAR CUENTA
      </button>

      <button onClick={onBackClick} className="bg-[#2D3E4E] text-white p-3 font-['Press_Start_2P'] mt-4 border-2 border-black hover:bg-[#3d5266]">
        VOLVER AL ACCESO
      </button>
    </div>
  );
}