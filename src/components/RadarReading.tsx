import { url } from "inspector";

const RadarReading =() => {

    return(
        <div className=" flex flex-col justify-center items-center shadow-lg rounded w-1/2 padding p-4 border-4 border-t-blue-200">
            <label  className="block text-black font-light text-2xl ">Radar Reading</label>
            <p className="text-blue-600 text-xl">#</p>
         
        </div>
    );
}
export default RadarReading;