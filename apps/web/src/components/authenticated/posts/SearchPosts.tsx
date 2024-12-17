import { faLocationDot, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Instrument } from "../../../enums/Instrument";
import { Button } from "../../Button";
import { InputField } from "../../InputField";
import { Select } from "../../Select";

interface Props {
  selectedInstrument: string | null;
  setSelectedInstrument: (instrument: string | null) => void;
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function SearchPosts({ selectedInstrument, setSelectedInstrument, handleSelectChange }: Props) {
  return (
    <div className="flex flex-col space-y-6 md:space-y-0 md:flex-col items-start w-full bg-white">
      {/* top side */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full px-0 py-6 mb-8 gap-y-4">
        <div className="relative w-full md:w-3/6">
          <InputField
            className="block w-full h-10 px-4 pr-10 border border-soft-gray bg-transparent font-medium text-base text-medium-gray rounded-[10px] outline-none shadow"
            id="searchPost"
            type="text"
            placeholder="Søg"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute top-1/2 right-4 transform -translate-y-1/3 text-medium-gray cursor-pointer"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-x-4 md:w-auto">
          <Button
            title="All"
            className="h-10 px-4 pt-0 pb-0 text-white bg-steel-blue text-xs rounded-[25px] hover:bg-gray-100 hover:text-steel-blue"
            onClick={() => console.log("All")}
          />
          <Button
            title="Find musicians"
            className="h-10 px-4 pt-0 pb-0 text-steel-blue bg-gray-100 text-xs rounded-[25px] hover:bg-steel-blue hover:text-gray-100"
            onClick={() => console.log("Find musicians")}
          />
          <Button
            title="Find ensemble"
            className="h-10 px-4 pt-0 pb-0 text-steel-blue bg-gray-100 text-xs rounded-[25px] hover:bg-steel-blue hover:text-gray-100"
            onClick={() => console.log("Find ensemble")}
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-6 mt-4 w-full">
        {/* Instrument Select */}
        <div className="flex flex-col w-full md:w-1/3">
          <div className="flex justify-between items-center mb-10">
            <p className="text-[14px] text-steel-blue font-semibold mb-0">Instrument</p>
            <Button
              title="Ryd"
              className="text-steel-blue text-center h-10 pt-0 pb-0 bg-white border text-xs rounded-[10px] hover:bg-gray-100 hover:text-steel-blue"
              onClick={() => setSelectedInstrument(null)}
            />
          </div>

          <Select
            label=""
            onChange={handleSelectChange}
            options={Object.values(Instrument).map((type) => type.toString())}
            value={selectedInstrument}
            className="w-full h-10 py-[8px] border border-soft-gray rounded-[10px] bg-purple-400"
          />
        </div>

        {/* Location Input */}
        <div className="relative w-full md:w-2/3">
          <div className="flex justify-between items-center mb-9">
            <p className="text-[14px] text-steel-blue font-semibold mb-0">Område</p>
            <Button
              title="Ryd"
              className="text-steel-blue text-center pt-0 pb-0 h-10 bg-white border text-xs rounded-[10px] hover:bg-gray-100 hover:text-steel-blue"
              onClick={() => console.log("Button")}
            />
          </div>

          <div className="flex items-center">
            {/* Icon Box */}
            <div className="h-[38px] w-14 flex items-center justify-center border rounded-[10px] mr-4 relative ">
              <FontAwesomeIcon icon={faLocationDot} color="red" />
            </div>

            {/* Input Field */}
            <InputField
              type="text"
              placeholder="By, postnr. eller adresse"
              className="w-full h-10 px-4 border border-soft-gray bg-transparent font-medium text-base text-medium-gray rounded-[10px] outline-none"
            />

            {/* Distance Slider */}
            <div className="flex flex-col w-3/5 ml-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[13px] text-medium-gray mb-0">Afstand</p>
                <span className="text-dark font- text-sm">50 km</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="w-full h-[2px] bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPosts;
