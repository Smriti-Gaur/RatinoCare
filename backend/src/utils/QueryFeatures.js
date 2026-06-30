class QueryFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = [
      "page",
      "limit",
      "sort",
      "search",
    ];

    excludedFields.forEach(field => {
      delete queryObj[field];
    });

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {

      const sortBy =
        this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);

    } else {

      this.query = this.query.sort("-createdAt");

    }

    return this;
  }

  paginate() {

    const page =
      Number(this.queryString.page) || 1;

    const limit =
      Number(this.queryString.limit) || 10;

    const skip =
      (page - 1) * limit;

    this.query = this.query
      .skip(skip)
      .limit(limit);

    return this;

  }

  async execute() {

    return await this.query;

  }

}

export default QueryFeatures;
