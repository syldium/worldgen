import { isActive, relativePath } from '../../main/util/UriHelper';

describe('UriHelper', function () {
  it('should be active', () => {
    expect(isActive('/', '/')).toBeTruthy();
    expect(isActive('/dimension', '/dimension')).toBeTruthy();
    expect(isActive('/dimension/namespaced:key', '/dimension')).toBeTruthy();
    expect(
      isActive('/dimension_type/namespaced:key', '/dimension_type')
    ).toBeTruthy();
  });

  it("shouldn't be active", () => {
    expect(isActive('/test', '/')).toBeFalsy();
    expect(
      isActive('/dimension_type/namespaced:key', '/dimension')
    ).toBeFalsy();
  });

  it('should use relative path', () => {
    expect(relativePath('test', '/deep')).toEqual('/test');
    expect(relativePath('test', '/very/deep')).toEqual('/very/test');
  });
});
