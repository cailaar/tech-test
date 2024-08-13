import { loadQuestions, createField, createQuestion } from './main'; 

// Mocking fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ questions: [] }),
  }) as unknown as Promise<Response>
);

describe('loadQuestions', () => {
  test('should load questions from the API', async () => {
    const data = await loadQuestions();
    expect(data).toEqual({ questions: [] });
  });

  test('should throw an error if the response is not 200', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false } as Response)
    );
    await expect(loadQuestions()).rejects.toThrow('Data not loaded');
  });
});

describe('createField', () => {
  test('should create an input field with text type and adhere to regex pattern', () => {
    const field = {
      element: 'input',
      type: 'text',
      placeholder: 'Enter text',
    };
    const element = createField(field) as HTMLInputElement;
    expect(element.tagName).toBe('INPUT');
    expect(element.type).toBe('text');
    expect(element.placeholder).toBe('Enter text');
    expect(element.pattern).toBe('[a-zA-Z\\s-]*');
  });

  test('should create a select field with options', () => {
    const field = {
      element: 'select',
      type: 'select',
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
      ],
    };
    const element = createField(field) as HTMLSelectElement;
    expect(element.tagName).toBe('SELECT');
    expect(element.children.length).toBe(3); // including the placeholder
  });

  test('should throw an error for if field element type is unrecognised', () => {
    const field = { element: 'unknown' } as any;
    expect(() => createField(field)).toThrow('Invalid field element type: unknown');
  });
});

describe('createQuestion', () => {
  test('should create a question container with fields', () => {
    const question = {
      id: 1,
      title: 'Sample Question',
      fields: [
        { element: 'input', type: 'text' },
        { element: 'select', type: 'select', options: [{ label: 'Option A', value: 'A' }] },
      ],
    };
    const element = createQuestion(question) as HTMLDivElement;
    expect(element.className).toBe('question');
    expect(element.querySelector('label')?.textContent).toBe('Sample Question');
    expect(element.querySelectorAll('input').length).toBe(1);
    expect(element.querySelectorAll('select').length).toBe(1);
  });
});
