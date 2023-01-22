// Select Elements
const scaleSelectorElement = document.getElementById("ConfigScaleType");
const mainGeneratedElement = document.getElementById("GeneratedMain");
const scaleTypeDescriptionElement = document.getElementById("ScaleTypeDescription");

// Define utility functions.
const setInnerText = function(textElement, newText) {
    textElement.innerHTML = '';
    textElement.innerHTML = newText;
}

const updateScaleStyleClass = function(scaleTypeClassElement) {
    if (scaleTypeClassElement.classList.contains('scale-type-minor')) {
        scaleTypeClassElement.classList.replace('scale-type-minor', 'scale-type-major');
    }
    else if(scaleTypeClassElement.classList.contains('scale-type-major')) {
        scaleTypeClassElement.classList.replace('scale-type-major', 'scale-type-minor');
    }
}


// Changes.
const updateScaleType = function(newScaleType) {
    setInnerText(scaleTypeDescriptionElement, newScaleType);
    updateScaleStyleClass(mainGeneratedElement);
}


// Handle changes.
const handleScaleTypeChange = function(changeEvent) {
    const newScaleTypeValue = changeEvent.target.value;

    updateScaleType(newScaleTypeValue);
}



// Wire up functionality.
scaleSelectorElement.addEventListener("change", handleScaleTypeChange);