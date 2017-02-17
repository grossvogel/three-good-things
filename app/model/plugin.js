module.exports.created_at = function(schema, _options) {
  schema.add({ created_at: Date });
  schema.pre('save', function(next) {
    if(!this.created_at) {
      this.created_at = new Date;
    }
    next();
  });
};

module.exports.updated_at = function(schema, _options) {
  schema.add({ updated_at: Date });
  schema.pre('save', function(next) {
    this.updated_at = new Date;
    next();
  });
};
