// Define constants.
const NOTES = new Array('A', 'B-flat', 'B', 'C', 'C-sharp', 'D', 'E-flat', 'E', 'F', 'F-sharp', 'G', 'G-sharp');
const MAJOR_SCALE_PATTERN = new Array('W', 'W', 'H', 'W', 'W', 'W', 'H');
const MINOR_SCALE_PATTERN = new Array('W', 'H', 'W', 'W', 'H', 'W', 'W');
const SCALE_NOTES_COUNT = 8;

// Select Elements
const scaleSelectorElement = document.getElementById("ConfigScaleType");
const rootNoteSelectorElement = document.getElementById("ConfigRootNote");
const mainGeneratedElement = document.getElementById("GeneratedMain");
const scaleTypeDescriptionElement = document.getElementById("ScaleTypeDescription");
const rootNoteDescriptionElement = document.getElementById("RootNoteDescription");
const scaleStepsListElement = document.getElementById("steps");
const scaleDegreeElements = {
    scaleDegree1: document.getElementById("scale-degree-1"),
    scaleDegree2: document.getElementById("scale-degree-2"),
    scaleDegree3: document.getElementById("scale-degree-3"),
    scaleDegree4: document.getElementById("scale-degree-4"),
    scaleDegree5: document.getElementById("scale-degree-5"),
    scaleDegree6: document.getElementById("scale-degree-6"),
    scaleDegree7: document.getElementById("scale-degree-7"),
    scaleDegree8: document.getElementById("scale-degree-8")
};

// Define utility functions.
const convertTextToAccidental = function(noteText) {
    var parts = noteText.split('-');
    var accidental = (parts.length > 1) ? `&${parts[1]};` : '';

    return `${parts[0]}${accidental}`;
};

const setInnerText = function(textElement, newText) {
    textElement.innerHTML = '';
    textElement.innerHTML = newText;
};

const updateScaleStyleClass = function(scaleTypeClassElement, scaleType) {
    var scaleTypeClass = `scale-type-${scaleType}`;

    if (scaleTypeClassElement.classList.contains('scale-type-minor')) {
        scaleTypeClassElement.classList.replace('scale-type-minor', scaleTypeClass);
    }
    else if (scaleTypeClassElement.classList.contains('scale-type-major')) {
        scaleTypeClassElement.classList.replace('scale-type-major', scaleTypeClass);
    }
};

const getScalePattern = function(scaleType) {
    return (scaleType === 'minor') ? MINOR_SCALE_PATTERN : MAJOR_SCALE_PATTERN;
};

const getStepPattern = function(scaleType) {
    var pattern = getScalePattern(scaleType);

    return pattern.map((step) => step === 'W' ? 2 : 1);
};

const generateScale = function(rootNote, scaleType) {
    let generatedNoteScale = [];
    const notesEnd = NOTES.length;
    const scaleEnd = SCALE_NOTES_COUNT;
    const scaleRootIndex = NOTES.indexOf(rootNote);
    const stepAddends = getStepPattern(scaleType);
    let step = 0;
    let currentScaleIndex = scaleRootIndex;

    for (let i = 0; i < scaleEnd; i++) {
        currentScaleIndex = (currentScaleIndex + step) % notesEnd;
        generatedNoteScale[i] = NOTES[currentScaleIndex];
        step = stepAddends[i];
    }

    return generatedNoteScale;
};

const getOrdinalText = function(scaleDegreeElement) {
    let ordinalText = '';

    if (!scaleDegreeElement || typeof scaleDegreeElement != 'object') {
        console.error('scaleDegreeElement was not found.');

        return ordinalText;
    }

    if (scaleDegreeElement && scaleDegreeElement.id && scaleDegreeElement.id.length > 0) {
        const lastIdPosition = scaleDegreeElement.id.length - 1;
        const lastIdCharcater = scaleDegreeElement.id.substring(lastIdPosition);
        const num = parseInt(lastIdCharcater, 10);

        switch(num) {
            case 1:
                ordinalText = 'First';
                break;

            case 2:
                ordinalText = 'Second';
                break;

            case 3:
                ordinalText = 'Third';
                break;

            case 4:
                ordinalText = 'Fourth';
                break;

            case 5:
                ordinalText = 'Fifth';
                break;

            case 6:
                ordinalText = 'Sixth';
                break;

            case 7:
                ordinalText = 'Seventh';
                break;

            case 8:
                ordinalText = 'Eighth';
                break;

            case 9:
                ordinalText = 'Ninth';
                break;

            case 0:
            default:
                ordinalText = 'Zeroth';
                break;
        }
    }

    return ordinalText;
};

const updateScaleDegree = function(scaleDegreeElement, note) {
    var noteDisplayText = convertTextToAccidental(note);
    var ordinalText = getOrdinalText(scaleDegreeElement);
    var scaleDegreeTemplate = `<span title='${ordinalText} scale degree'>${noteDisplayText}</span>`;

    setInnerText(scaleDegreeElement, scaleDegreeTemplate);
}

const updateNotes = function(rootNote) {
    var selectedScaleIndex = scaleSelectorElement.options.selectedIndex;
    var currentScale = scaleSelectorElement.options[selectedScaleIndex].value.toLowerCase();
    var scaleNotes = generateScale(rootNote, currentScale);

    if (scaleNotes.length > 0 && scaleNotes.length <= 8) {
        scaleNotes.forEach((note, index) => {
            var degreeId = (index + 1).toString();
            updateScaleDegree(scaleDegreeElements[`scaleDegree${degreeId}`], note);
        });
    } else {
        console.error('Did not generate scale.', rootNote);
    }
};

const updateScaleSteps = function(scaleStepsListElement, scaleType) {
    var scaleStepsListItems = '';
    var pattern = getScalePattern(scaleType);

    pattern.forEach((step) => {
        var stepText = (step === 'W') ? 'whole' : 'half';
        var scaleStepsListItemsTemplate = `\n\t\t\t\t<li class="step ${stepText}">${step}</li>`;
        scaleStepsListItems += scaleStepsListItemsTemplate;
    });

    setInnerText(scaleStepsListElement, scaleStepsListItems);
};

// Changes.
const updateScaleType = function(newScaleType) {
    setInnerText(scaleTypeDescriptionElement, newScaleType);

    var scaleType = newScaleType.toLowerCase();

    updateScaleStyleClass(mainGeneratedElement, scaleType);
    updateScaleSteps(scaleStepsListElement, scaleType);
};

const updateRootNote = function(newRootNote) {
    var noteDisplayText = convertTextToAccidental(newRootNote);

    setInnerText(rootNoteDescriptionElement, noteDisplayText);
    updateNotes(newRootNote);
};


// Handle changes.
const handleScaleTypeChange = function(changeEvent) {
    const newScaleTypeValue = changeEvent.target.value;

    updateScaleType(newScaleTypeValue);
};

const handleRootNoteChange = function(changeEvent) {
    const newRootNoteValue = changeEvent.target.value;

    updateRootNote(newRootNoteValue);
};

// Wire up functionality.
scaleSelectorElement.addEventListener("change", handleScaleTypeChange);
rootNoteSelectorElement.addEventListener("change", handleRootNoteChange);
