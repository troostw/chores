import { ChorelistModule } from './chorelist.module';

describe('ChorelistModule', () => {
  let chorelistModule: ChorelistModule;

  beforeEach(() => {
    chorelistModule = new ChorelistModule();
  });

  it('should create an instance', () => {
    expect(chorelistModule).toBeTruthy();
  });
});
