import ImageCharts from "./";
import pkg from "./package.json";
import fs from 'fs';

describe("ImageCharts", () => {
  it("works in ES6", () => {
    expect(typeof ImageCharts).toMatchInlineSnapshot(`"function"`);
  });

  it("works in CommonJS", () => {
    expect(typeof require("./")).toMatchInlineSnapshot(`"function"`);
  });

  describe("toURL", () => {
    it("works", () => {
      expect(
        ImageCharts().cht("p").chd("t:1,2,3").toURL()
      ).toMatchInlineSnapshot(
        `"https://image-charts.com/chart?cht=p&chd=t%3A1%2C2%2C3"`
      );
    });

    it("works port override", () => {
      expect(
        ImageCharts({port: 8080}).cht("p").chd("t:1,2,3").toURL()
      ).toMatchInlineSnapshot(
        `"https://image-charts.com:8080/chart?cht=p&chd=t%3A1%2C2%2C3"`
      );
    });

    it("exposes parameters and use them", () => {
      const ic = ImageCharts();
      const {chart, query} = Object.keys(ic.__proto__)
        .filter((method) => method.startsWith("c") || method.startsWith("ic"))
        .reduce((m, method_name) => {
          m.chart = m.chart[method_name]("plop");
          m.query.push(`${method_name}=plop`);
          return m;
        }, {chart: ic, query: []});

      expect(chart.toURL()).toMatchInlineSnapshot(
        `"https://image-charts.com/chart?${query.join('&')}"`
      );
    });

    it("adds a signature when icac and secrets are defined", () =>
      expect(
        ImageCharts({secret: "plop"})
          .cht("p")
          .chd("t:1,2,3")
          .chs("100x100")
          .icac("test_fixture")
          .toURL()
      ).toMatchInlineSnapshot(
        `"https://image-charts.com/chart?cht=p&chd=t%3A1%2C2%2C3&chs=100x100&icac=test_fixture&ichm=71bd93758b49ed28fdabd23a0ff366fe7bf877296ea888b9aaf4ede7978bdc8d"`
      ));
  });

  describe("toBuffer", () => {
    it("rejects if a chs is not defined", () =>
      expect(
        ImageCharts().cht("p").chd("t:1,2,3").toBuffer()
      ).rejects.toMatchInlineSnapshot(`[Error: "chs" is required]`));

    it("rejects if a icac is defined without ichm", () =>
      expect(
        ImageCharts()
          .cht("p")
          .chd("t:1,2,3")
          .chs("100x100")
          .icac("test_fixture")
          .toBuffer()
      ).rejects.toMatchInlineSnapshot(`[Error: IC_MISSING_ENT_PARAMETER]`));

    it("rejects if timeout is reached", () =>
      expect(
        ImageCharts({timeout: 1}) // 1ms
          .cht("p")
          .chd("t:1,2,3")
          .chs("100x100")
          .chan("1200")
          .toBuffer()
      ).rejects.toMatchInlineSnapshot(
        `[FetchError: network timeout at: https://image-charts.com/chart?cht=p&chd=t%3A1%2C2%2C3&chs=100x100&chan=1200]`
      ));

    it("works", () =>
      expect(
        ImageCharts().cht("p").chd("t:1,2,3").chs("2x2").toBuffer()
      ).resolves.toMatchSnapshot());

    it("forwards package_name/version as user-agent", () =>
      ImageCharts()
        .cht("p")
        .chd("t:1,2,3")
        .chs("10x10")
        .toBuffer()
        .then((buff) =>
          expect(buff._request.headers["User-Agent"]).toStrictEqual(
            `javascript-${pkg.name}/${pkg.version}`
          )
        ));

    it("forwards package_name/version (icac) as user-agent", () =>
      ImageCharts()
        .cht("p")
        .chd("t:1,2,3")
        .chs("10x10")
        .icac("MY_ACCOUNT_ID")
        .toBuffer()
        .catch((err) =>
          expect(err._request.headers["User-Agent"]).toStrictEqual(
            `javascript-${pkg.name}/${pkg.version} (MY_ACCOUNT_ID)`
          )
        ));
  });

  describe("toDataURI", () => {
    it("rejects if there was an error", () =>
      expect(
        ImageCharts().cht("p").chd("t:1,2,3").toDataURI()
      ).rejects.toMatchInlineSnapshot(`[Error: "chs" is required]`));

    it("works", () =>
      expect(
        ImageCharts().cht("p").chd("t:1,2,3").chs("2x2").toDataURI()
      ).resolves.toMatchInlineSnapshot(
        `"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQAAAABazTCJAAAADElEQVR42mM4wHAAAAMEAYEq5W5aAAAAAElFTkSuQmCC"`
      ));

    it("support gifs", () =>
      ImageCharts()
        .cht("p")
        .chd("t:1,2,3")
        .chan("100")
        .chs("2x2")
        .toDataURI()
        .then((data_uri) =>
          expect(data_uri.substring(0, 30)).toMatchInlineSnapshot(
            `"data:image/gif;base64,R0lGODlh"`
          )
        ));
  });

  describe("toFile", () => {
    it("rejects if there was an error", () =>
      expect(
        ImageCharts().cht("p").chd("t:1,2,3").toFile('/tmp/chart.png')
      ).rejects.toMatchInlineSnapshot(`[Error: "chs" is required]`));

    it("rejects when the path is invalid", () => {
      const file_path = '/__invalid_path/chart.png';
      return expect(ImageCharts()
        .cht("bvg").chd("t:1,2,3").chs("40x40")
        .toFile(file_path)).rejects.toBeDefined();
    });

    it("works", () => {
      const file_path = '/tmp/chart.png';
      return ImageCharts()
        .cht("bvg").chd("t:1,2,3").chs("40x40")
        .toFile(file_path)
        .then(() =>
          expect(fs.existsSync(file_path)).toBe(true)
        );
    });
  });

  describe("protocol", () => {
    it("expose the protocol", () => {
      expect(ImageCharts()._protocol).toMatchInlineSnapshot(`"https"`);
    });

    it("let protocol to be user-defined", () => {
      expect(ImageCharts({protocol: "http"})._protocol).toMatchInlineSnapshot(
        `"http"`
      );
    });
  });

  describe("host", () => {
    it("expose the host", () => {
      expect(ImageCharts()._host).toMatchInlineSnapshot(`"image-charts.com"`);
    });

    it("let host to be user-defined", () => {
      expect(
        ImageCharts({host: "on-premise-image-charts.com"})._host
      ).toMatchInlineSnapshot(`"on-premise-image-charts.com"`);
    });
  });

  describe("pathname", () => {
    it("expose the pathname", () => {
      expect(ImageCharts()._pathname).toMatchInlineSnapshot(`"/chart"`);
    });
  });

  describe("port", () => {
    it("expose the port", () => {
      expect(ImageCharts()._port).toMatchInlineSnapshot(`443`);
    });

    it("let port to be user-defined", () => {
      expect(ImageCharts({port: 8080})._port).toMatchInlineSnapshot(`8080`);
    });
  });

  describe("query", () => {
    it("expose the port", () => {
      expect(ImageCharts()._query).toMatchInlineSnapshot(`Object {}`);
    });

    it("expose the query", () => {
      expect(ImageCharts().cht("p").chd("t:1,2,3").icac("plop")._query)
        .toMatchInlineSnapshot(`
        Object {
          "chd": "t:1,2,3",
          "cht": "p",
          "icac": "plop",
        }
      `);
    });
  });
});
