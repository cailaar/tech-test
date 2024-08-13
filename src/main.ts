// first creating type definitions for the shape of the API response

type FieldOption = {
  label: string;
  value: string;
};

type Field = {
  element: string;
  type: string;
  placeholder?: string;
  options?: FieldOption[];
};

type Question = {
  id: number;
  title: string;
  fields: Field[];
};

type ApiResponse = {
  questions: Question[];
};

// fetching the questions from the API, basic error handling

export async function loadQuestions(): Promise<ApiResponse> {
  const response = await fetch('api.json');
  if (!response.ok) {
    throw new Error('Data not loaded');
  }
  return response.json();
}

// creating the HTML form elements based on what field it represents

export function createField(field: Field): HTMLElement {
  let element: HTMLElement;

  switch (field.element) {
    case 'input':
      element = document.createElement('input');
      (element as HTMLInputElement).type = field.type; // setting the type attribute
      if (field.placeholder) {
        (element as HTMLInputElement).placeholder = field.placeholder; // setting the placeholder attribute if it exists
      }
      
      // creating pattern for alpha characters, spaces, and hyphens if type is 'text' to ensure only valid characters are entered
      if (field.type === 'text') {
        (element as HTMLInputElement).pattern = "[a-zA-Z\\s-]*";
        (element as HTMLInputElement).title = "Only alphabetic characters, spaces, and hyphens are allowed"; // could perhaps use an aria-label in conjunction, but providing extra info on hover
        (element as HTMLInputElement).addEventListener('input', (event) => {
          (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(/[^a-zA-Z\s-]/g, '');
        }); // enforcing the pattern by removing any invalid characters
      }
      break;

    case 'select':
      element = document.createElement('select');

      // setting a default placeholder option so the user knows to select an option
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = field.placeholder || 'Select a vehicle'; // providing a default placeholder if none is provided
      placeholderOption.disabled = true; // so the placeholder option can't be selected as a valid option
      placeholderOption.selected = true; // ensuting it's the default selected option
      (element as HTMLSelectElement).appendChild(placeholderOption);

      // adding the other options
      if (field.options) {
        for (const option of field.options) {
          const optionElement = document.createElement('option');
          optionElement.value = option.value;
          optionElement.textContent = option.label;
          (element as HTMLSelectElement).appendChild(optionElement);
        }
      }
      break;

    default:
      throw new Error(`Invalid field element type: ${field.element}`); // throwing an error if the field element type doesn't match any of the known types
  }

  return element;
}

// creating the questions container with labels and appending fields to the container
export function createQuestion(question: Question): HTMLElement {
  const questionContainer = document.createElement('div');
  questionContainer.className = 'question'; // for styling 

  const title = document.createElement('label');
  title.textContent = question.title;
  questionContainer.appendChild(title);

  for (const field of question.fields) {
    const fieldElement = createField(field);
    questionContainer.appendChild(fieldElement);
  }

  return questionContainer;
}

// fetching the API data and appending the questions and fields to the form via the HTML id
async function generateForm() {
  try {
    const data = await loadQuestions();
    const form = document.getElementById('dynamic-form') as HTMLFormElement;

    for (const question of data.questions) {
      const questionElement = createQuestion(question);
      form.appendChild(questionElement);
    }
  } catch (error) {
    console.error('Error generating form:', error);
  }
}

generateForm();

