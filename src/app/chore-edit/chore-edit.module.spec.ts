import { ChoreEditModule } from './chore-edit.module';

describe('ChoreEditModule', () => {
  let choreEditModule: ChoreEditModule;

  beforeEach(() => {
    choreEditModule = new ChoreEditModule();
  });

  it('should create an instance', () => {
    expect(choreEditModule).toBeTruthy();
  });
});
