import logo from "/PPT.png"

export const LoadingDog: React.FC = () => {
  return (
    <div className="inset-0 absolute flex items-center justify-center bg-bgPrimary">
      <img src={logo} alt="logo" className="w-1/6" />
    </div>
  )
}
