import { useState } from "react";
import Field from "../Field/Field";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import "./SearchBar.css";

export default function SearchBar({
    value,              //1. Receive value from Parent
    onChange,           //2. Notify Parent of changes
    onSearch,           //3. Trigger immediate search (Enter)
    onIsSearching,      //4. Notify Parent of search state
    results, 
    resultsOnSelect, 
    controlContainer, 
    hangingContainer, 
    searchFieldContainerStyleClass,
    searchFieldContainerStyleId, 
    searchFieldStyleId,
    buttonStyleClass,
    prompt
}){

    const [isSearching, setIsSearching] = useState(false);

    const handleKeySubmit = (e) => {
        if(e.key === "Enter" && onSearch) {
            onSearch(value); // Pass the current value up
        }
    }

    const handleIsSearching = () => {
        setIsSearching(!isSearching);
        if(onIsSearching) 
            onIsSearching(!isSearching);
    }

    // Determine the options names for the dropdown
    const getResultsNames = () => results ? results.map((result) => result.name) : [];

    // Define input field 
    const inputField = ( 
        <Field 
            type="text" 
            prompt={prompt || "Search..."}
            value={value}              // Controlled: Value comes from props
            onChange={(e) => onChange?.(e.target.value)} // Controlled: Notify parent
            onKeyDown={handleKeySubmit}
            styleClass={`search-bar ${isSearching ? "active" : ""}`} 
            styleId={searchFieldContainerStyleId} 
            inputStyle={searchFieldStyleId} 
        />
    ); 

    return(
        <div className={`search-bar-container ${searchFieldContainerStyleClass}`}>  
            <div className="search-bar-field-container">
                 
                <button 
                    className={`${buttonStyleClass}`}
                    onClick={handleIsSearching} 
                    id="search-toggle-button"
                />
                    
                <div className={`search-bar-search-type-container ${isSearching ? "active" : ""}`}>
                    <DropDownMenu 
                        styleClass="search-results-dropdown" 
                        styleId="wrapper-search-results-dropdown"
                        options={getResultsNames()} 
                        optionsMetaData={results} 
                        onChange={resultsOnSelect} 
                        autoOpen={true}
                    >
                        {inputField}
                    </DropDownMenu>

                    {/* Optional control container */}
                    {controlContainer}
                </div>
            </div>
            
            {/* Hanging elements (filters/sorting) */}
            {hangingContainer}    
        </div>
    );
}