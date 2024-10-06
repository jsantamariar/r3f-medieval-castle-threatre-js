import micOff from "../assets/mic-off.svg";
import micOn from "../assets/mic-on.svg";

export const AudioMusic = ({ isPlaying, toggleAudio }) => {
  return (
    <button
      className={`bg-white text-black p-2 rounded absolute right-5 top-5 z-50 ${
        !isPlaying ? "opacity-100" : "opacity-50 hover:opacity-100 shadow-lg"
      }`}
      onClick={toggleAudio}
    >
      {isPlaying ? (
        // mic off
        <img src={micOff} alt="mic off" />
      ) : (
        //mic on
        <img src={micOn} alt="mic on" />
      )}
    </button>
  );
};
