import {SchemaBase, field, copyAndUnsetDefaults} from './SchemaBase'

class TestImpl extends SchemaBase {
    static create(fields: Partial<TestImpl>) {
      return super.initialize(this, fields);
    }

    constructor(fields: Partial<TestImpl>) {
      super(fields);
    }

    withoutDefaults() {
      return copyAndUnsetDefaults(TestImpl, this);
    }

    @field({
      primaryKey: true,
      allowNull: false,
      maxLength: 32,
      default: '',
      valid: [13],
    }) pkey: number;

    @field({
      primaryKey: true,
      allowNull: false,
      maxLength: 32,
      default: 'defaultstr',
    }) qkey: string;

    @field({}) rkey: number;
}

describe('SchemaBase', () => {
  it('create() returns the class object when valid', () => {
    const t = TestImpl.create({pkey: 13});
    expect(t instanceof TestImpl).toEqual(true);
  });
  it('create() returns error when validation fails', () => {
    const t = TestImpl.create({pkey: 16});
    expect(t instanceof Error).toEqual(true);
  });
  it('Excludes parameters not matching a field', () => {
    const t = new TestImpl({pkey: 13, notAKey: true} as any);
    expect((t as any).notAKey).toBeUndefined();
  });
  it('Applies defaults for fields not specified', () => {
    const t = new TestImpl({pkey: 13});
    expect(t.qkey).toEqual('defaultstr');
  });
  it('withoutDefaults returns the object with defaulted params set to null', () => {
    const t = new TestImpl({pkey: 13}).withoutDefaults();
    expect(t.qkey).toEqual(undefined);
  });
  it('Coerces types as part of validation', () => {
    const t = new TestImpl({pkey: ('13' as any)});
    expect(typeof(t.pkey)).toEqual('number');
  });
  it('Coerces a number even if the field has no extra options', () => {
    const t = new TestImpl({pkey: 13, rkey: ('13' as any)});
    expect(typeof(t.rkey)).toEqual('number');
  })
});