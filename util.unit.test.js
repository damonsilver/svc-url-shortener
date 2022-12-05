const {
  ACCEPTABLE_URL_PROTOCOLS,
  isAcceptableUrl,
  isEmptyArray,
  handleRows,
} = require('./util');

describe('isEmptyArray', () => {
  describe('when the object is an array', () => {
    describe('when the array is empty', () => {
      it('returns true', () => {
        expect(isEmptyArray([])).toBeTruthy();
      });
    });

    describe('when the array is not empty', () => {
      it('returns false', () => {
        expect(isEmptyArray([1])).toBeFalsy();
      });
    });
  });

  describe('when the object is not an array', () => {
    it('returns false', () => {
      expect(isEmptyArray(123)).toBeFalsy();
    });
  });
});

describe('handleRows', () => {
  describe('when rows is truthy', () => {
    it('returns rows', () => {
      const rows = [1, 2, 'foo', 'bar'];
      expect(handleRows(rows) === rows).toBeTruthy();
    });
  });

  describe('when rows is falsy', () => {
    describe('when rows is empty', () => {
      it('returns an empty array', () => {
        expect(isEmptyArray(handleRows([]))).toBeTruthy();
      });
    });

    describe('when rows is null', () => {
      it('returns an empty array', () => {
        expect(isEmptyArray(handleRows(null))).toBeTruthy();
      });
    });

    describe('when rows is undefined', () => {
      it('returns an empty array', () => {
        expect(isEmptyArray(handleRows(undefined))).toBeTruthy();
      });
    });
  });
});

describe('isAcceptableUrl', () => {
  describe('when the URL is well-formed', () => {
    describe('when the URL begins with an acceptable protocol', () => {
      it('returns true', () => {
        for (const acceptableUrlProtocol in ACCEPTABLE_URL_PROTOCOLS) {
          let url = `${acceptableUrlProtocol}://foo.bar.baz`;
          expect(isAcceptableUrl(url)).toBeTruthy();
        }
      });
    });

    describe('when the URL does not begin with an acceptable protocol', () => {
      const url = 'ftp:///bad.prefix';

      it('returns false', () => {
        expect(isAcceptableUrl(url)).toBeFalsy();
      });
    });
  });

  describe('when the URL is not well-formed', () => {
    const url = 'NONSENSE VALUE';

    it('returns false', () => {
      expect(isAcceptableUrl(url)).toBeFalsy();
    });
  });
});
