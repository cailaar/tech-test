"use strict";
// first creating type definitions for the shape of the API response
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadQuestions = loadQuestions;
exports.createField = createField;
exports.createQuestion = createQuestion;
// fetching the questions from the API, basic error handling
function loadQuestions() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('api.json')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Data not loaded');
                    }
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
// creating the HTML form elements based on what field it represents
function createField(field) {
    var element;
    switch (field.element) {
        case 'input':
            element = document.createElement('input');
            element.type = field.type; // setting the type attribute
            if (field.placeholder) {
                element.placeholder = field.placeholder; // setting the placeholder attribute if it exists
            }
            // creating pattern for alpha characters, spaces, and hyphens if type is 'text' to ensure only valid characters are entered
            if (field.type === 'text') {
                element.pattern = "[a-zA-Z\\s-]*";
                element.title = "Only alphabetic characters, spaces, and hyphens are allowed"; // could perhaps use an aria-label in conjunction, but providing extra info on hover
                element.addEventListener('input', function (event) {
                    event.target.value = event.target.value.replace(/[^a-zA-Z\s-]/g, '');
                }); // enforcing the pattern by removing any invalid characters
            }
            break;
        case 'select':
            element = document.createElement('select');
            // setting a default placeholder option so the user knows to select an option
            var placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = field.placeholder || 'Select a vehicle'; // providing a default placeholder if none is provided
            placeholderOption.disabled = true; // so the placeholder option can't be selected as a valid option
            placeholderOption.selected = true; // ensuting it's the default selected option
            element.appendChild(placeholderOption);
            // adding the other options
            if (field.options) {
                for (var _i = 0, _a = field.options; _i < _a.length; _i++) {
                    var option = _a[_i];
                    var optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    element.appendChild(optionElement);
                }
            }
            break;
        default:
            throw new Error("Invalid field element type: ".concat(field.element)); // throwing an error if the field element type doesn't match any of the known types
    }
    return element;
}
// creating the questions container with labels and appending fields to the container
function createQuestion(question) {
    var questionContainer = document.createElement('div');
    questionContainer.className = 'question'; // for styling 
    var title = document.createElement('label');
    title.textContent = question.title;
    questionContainer.appendChild(title);
    for (var _i = 0, _a = question.fields; _i < _a.length; _i++) {
        var field = _a[_i];
        var fieldElement = createField(field);
        questionContainer.appendChild(fieldElement);
    }
    return questionContainer;
}
// fetching the API data and appending the questions and fields to the form via the HTML id
function generateForm() {
    return __awaiter(this, void 0, void 0, function () {
        var data, form, _i, _a, question, questionElement, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, loadQuestions()];
                case 1:
                    data = _b.sent();
                    form = document.getElementById('dynamic-form');
                    for (_i = 0, _a = data.questions; _i < _a.length; _i++) {
                        question = _a[_i];
                        questionElement = createQuestion(question);
                        form.appendChild(questionElement);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error generating form:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
generateForm();
