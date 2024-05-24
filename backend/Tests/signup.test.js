const { usernameSanatize } = require('../utils/username.utils');
const { passwordSanatize, hashPassword, comparePassword } = require('../utils/password.utils');


test('sanatize username', () => {

    expect(usernameSanatize("alireza")).toBe("alireza");
    expect(usernameSanatize("   ali")).toBe("ali");
    expect(usernameSanatize("ali   ")).toBe("ali");
    expect(usernameSanatize("AlI   ")).toBe("ali");
    expect(() => usernameSanatize("ali  $ ")).toThrow(TypeError);
    expect(() => usernameSanatize("  ")).toThrow(TypeError);
    expect(() => usernameSanatize(" 1ali  098 ")).toThrow(TypeError);
    expect(() => usernameSanatize(" alirezavahidi ")).toThrow(TypeError);
    expect(usernameSanatize(" alirezavah ")).toBe("alirezavah");
})

test('sanatize password', () => {
    expect(() => passwordSanatize("alireza")).toThrow(Error);
    expect(() => passwordSanatize("alirezasdddddddddddd")).toThrow(Error);
    expect(() => passwordSanatize("asdweqwrrt")).toThrow(Error);
    expect(() => passwordSanatize("asdwTTT")).toThrow(Error);
    expect(() => passwordSanatize("asdwTTT@@")).toThrow(Error);
    expect(passwordSanatize("asdwTTT@@548")).toBe("asdwTTT@@548");
    expect(passwordSanatize("   asdwTTT@@548        ")).toBe("asdwTTT@@548");
})

test('check password hash', () => {
    const a = hashPassword('12345');
    const b = '12345';
    const c = '132456879';
    expect(comparePassword(a, b)).toBe(true)
    expect(comparePassword(a, c)).toBe(false)
})