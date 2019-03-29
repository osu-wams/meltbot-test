import { createMessage } from '../lexUtils';

describe('Lex Utils - createMessage', () => {
  it('returns a message', () => {
    const message = createMessage();

    // Check default message properties
    expect(message.id).toBeDefined();
    expect(message.text).toEqual('');
    expect(message.type).toEqual('user');
  });
});
