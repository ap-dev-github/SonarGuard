import { url } from "inspector";

const RadarReading =() => {

    return(
        <div className=" flex flex-col justify-center items-center shadow-2xl rounded-3xl w-1/2 padding p-4 border-2  border-blue-200">
            <label  className="block text-black font-light text-2xl ">Radar Reading</label>
            <p className="text-blue-600 text-xl">#</p>
         
        </div>
    );
}
export default RadarReading;