import type { NextPage } from "next";

const LoadingScreen: NextPage = () => {
  return (
    <div className='w-full h-full fixed flex items-center justify-center' style={{"zIndex": 1, "backgroundColor": "rgba(0,0,0,0.7)"}}>
      <div>
        <img src="/loading.svg" alt="" />
        <h3 className='text-white text-center mt-6'>Loading</h3>
      </div>
    </div>
  );
}

export default LoadingScreen;