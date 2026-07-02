class QueryFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;

    this.filterQuery = {};

    this.page = 1;
    this.limit = 10;

    this.sortBy = "-createdAt";

    this.selectedFields = null;
  }

  filter() {
    const queryObj = { ...this.queryString };

    [
      "page",
      "limit",
      "sort",
      "search",
      "fields",
    ].forEach((field) => delete queryObj[field]);

    this.filterQuery = {
      ...this.filterQuery,
      ...queryObj,
    };

    return this;
  }
  addFilter(key, value) {

  this.filterQuery[key] = value;

  return this;

}

  search(searchFields = []) {
    if (
      this.queryString.search &&
      searchFields.length
    ) {
      const keyword = this.queryString.search;

      this.filterQuery.$or =
        searchFields.map((field) => ({
          [field]: {
            $regex: keyword,
            $options: "i",
          },
        }));
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.sortBy =
        this.queryString.sort
          .split(",")
          .join(" ");
    }

    return this;
  }

  selectFields() {
    if (this.queryString.fields) {
      this.selectedFields =
        this.queryString.fields
          .split(",")
          .join(" ");
    }

    return this;
  }

  paginate() {
    this.page = Math.max(
      Number(this.queryString.page) || 1,
      1
    );

    this.limit = Math.min(
      Number(this.queryString.limit) || 10,
      100
    );

    return this;
  }

  async execute(populateOptions = []) {
    const skip =
      (this.page - 1) * this.limit;

    let query = this.model
      .find(this.filterQuery)
      .sort(this.sortBy)
      .skip(skip)
      .limit(this.limit);

    if (this.selectedFields) {
      query = query.select(
        this.selectedFields
      );
    }

    populateOptions.forEach((option) => {
      query = query.populate(option);
    });

    return await query;
  }

  async paginateResult() {
    const totalRecords =
      await this.model.countDocuments(
        this.filterQuery
      );

    const totalPages =
      Math.ceil(
        totalRecords / this.limit
      );

    return {
      page: this.page,
      limit: this.limit,
      totalRecords,
      totalPages,
      hasNextPage:
        this.page < totalPages,
      hasPrevPage:
        this.page > 1,
    };
  }
}

export default QueryFeatures;