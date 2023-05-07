declare namespace Deez {
  type Item = {
    content: string;
    url: {
      href: string;
      host: string;
      path: string;
      search: string;
    };
    placement: {
      x: number;
      y: number;
      sx: number;
      sy: number;
      selector: string;
    };
  };
}
