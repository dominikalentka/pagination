export default {
    editor: {
      label: { en: "Accessible Pagination" }
    },
    properties: {
      totalItems: {
        label: { en: "Total Items" },
        type: "Number",
        defaultValue: 100
      },
      perPageOptions: {
        label: { en: "Items Per Page Options" },
        type: "Array",
        defaultValue: [10, 25, 50, 100]
      },
      defaultPerPage: {
        label: { en: "Default Items Per Page" },
        type: "Number",
        defaultValue: 25
      }
    }
  }
  