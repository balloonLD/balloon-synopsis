module.exports = function(Handlebars) {

var templates = {};

templates["components.nav"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += " "
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  return buffer;
  }

  buffer += "<li>\n    <a class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.btn)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  stack2 = helpers.each.call(depth0, depth0.class_in, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" href=\"#\">\n        ";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n    </a>\n</li>";
  return buffer;
  });

templates["components.scroll"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.scroll_box_content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n</div>";
  return buffer;
  });

templates["history"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.history)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n</div>";
  return buffer;
  });

templates["layer"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += " "
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n                                <li><a class=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" href=\"#\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.prefix || depth0.prefix),stack1 ? stack1.call(depth0, depth0.msg, "sorter-prefix", depth0.id, options) : helperMissing.call(depth0, "prefix", depth0.msg, "sorter-prefix", depth0.id, options)))
    + "</a></li>\n                            ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n                            <li><a class=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" href=\"#\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.prefix || depth0.prefix),stack1 ? stack1.call(depth0, depth0.msg, "filter-prefix", depth0.id, options) : helperMissing.call(depth0, "prefix", depth0.msg, "filter-prefix", depth0.id, options)))
    + "</a></li>\n                        ";
  return buffer;
  }

  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.layer)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  stack2 = helpers.each.call(depth0, depth0.class_in, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.menu)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " container-fluid\">\n        <div class=\"row\">\n            <div class=\"col-lg-offset-2 col-md-offset-1 col-xs-offset-0 col-lg-5 col-md-6 col-xs-7 "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.filter)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                <div class=\"input-group\">\n                    <input type=\"text\" class=\"form-control\" aria-label=\"...\">\n\n                    <div class=\"input-group-btn\">\n                        <button type=\"button\" class=\"btn btn-default "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.filter_btn)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\n                                aria-expanded=\"false\"> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "filter", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "filter", options)))
    + " <span></span></button>\n                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\"\n                                aria-expanded=\"false\"> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "filter_options", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "filter_options", options)))
    + " <span class=\"caret\"></span>\n                        </button>\n                        <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n                            ";
  stack2 = helpers.each.call(depth0, depth0.filter, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                        </ul>\n                    </div>\n                    <!-- /btn-group -->\n                </div>\n                <!-- /input-group -->\n            </div>\n            <div class=\"col-lg-3 col-md-4 col-xs-5 "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.sorter)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                <div class=\"dropdown\">\n                    <label class=\"control-label\" for=\"sortDropDown\"\n                           style=\"text-align:right\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "sorter", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "sorter", options)))
    + "</label>\n                    <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"sortDropDown\"\n                            data-toggle=\"dropdown\" aria-expanded=\"true\">\n                        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "sorter_default", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "sorter_default", options)))
    + "\n                        <span class=\"caret\"></span>\n                    </button>\n                    <ul class=\"col-sm-8 dropdown-menu\" role=\"menu\" aria-labelledby=\"sortDropDown\">\n                        ";
  stack2 = helpers.each.call(depth0, depth0.sorter, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.layout_container)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n\n    </div>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.layout_footer)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_msg || depth0.get_msg),stack1 ? stack1.call(depth0, depth0.msg, "empty", options) : helperMissing.call(depth0, "get_msg", depth0.msg, "empty", options)))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["overlay"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n                        <li><a id=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" href=\"#\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.get_filter || depth0.get_filter),stack1 ? stack1.call(depth0, depth0.msg, depth0.id, options) : helperMissing.call(depth0, "get_filter", depth0.msg, depth0.id, options)))
    + "</a></li>\n                    ";
  return buffer;
  }

  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.overlay)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"z-index : ";
  if (stack2 = helpers.z_index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.z_index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ";\">\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.menu)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " navbar\">\n        <div class=\"container\">\n            <div class=\"navbar-header syn_menu_label navbar-left\">\n                <a class=\"navbar-brand\" disabled=\"\">\n                    <b>";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</b>\n                    <small>";
  if (stack2 = helpers.label_small) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label_small; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\n                </a>\n            </div>\n            <div class=\"collapse navbar-collapse syn_navbar_collapse navbar-right\">\n                <ul class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.overlay_menu)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " nav navbar-nav\">\n                    ";
  stack2 = helpers.each.call(depth0, depth0.nav, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.overlay_content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    </div>\n</div>";
  return buffer;
  });

templates["overlay_container"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.overlay_container)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n</div>";
  return buffer;
  });

templates["progress"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.progress_container_wrap)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " col-lg-offset-1 col-md-offset-1 col-xs-offset-1 col-lg-10 col-md-10 col-xs-10\">\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.progress_container)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"> </div>\n</div>";
  return buffer;
  });

templates["progress_bar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"col-lg-2 col-md-3 col-xs-4\" style=\"display: flex; flex-direction: column; justify-content: center;\">\n    <div>\n        ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </div>\n    <div class=\"progress\">\n        <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.progress_bar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " progress-bar progress-bar-success\" style=\"width: 0%\"></div>\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.default"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    "
    + escapeExpression(((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</div>";
  return buffer;
  });

templates["tiles.incoming.blank"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Subgraph:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.subject)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    <b>is subject of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.incoming.named"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Resource:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.subject)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    <b>is subject of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.map"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"width:404px; height: 200px\">\n    <iframe width=\"404\" height=\"200\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"https://maps.google.com/?ie=UTF8&amp;t=m&amp;ll="
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.longitude)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ","
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.latitude)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "&amp;spn=0.079502,0.145912&amp;z=12&amp;output=embed\"></iframe>\n</div>";
  return buffer;
  });

templates["tiles.multi.named"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <b>is object of:</b>\n    ";
  stack2 = helpers.each.call(depth0, ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triples)),stack1 == null || stack1 === false ? stack1 : stack1.out), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth1.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth1.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.predicate),stack1 == null || stack1 === false ? stack1 : stack1.nominalValue)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n        </div>\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <b>is subject of:</b>\n    ";
  stack2 = helpers.each.call(depth0, ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triples)),stack1 == null || stack1 === false ? stack1 : stack1.inc), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  return buffer;
  }

  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Resource:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.resource)),stack1 == null || stack1 === false ? stack1 : stack1.nominalValue)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triples)),stack1 == null || stack1 === false ? stack1 : stack1.out)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triples)),stack1 == null || stack1 === false ? stack1 : stack1.inc)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>";
  return buffer;
  });

templates["tiles.outgoing.blank"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Subgraph:</b>\n    <div class=\"\">\n    </div>\n    <b>is object of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.outgoing.literal"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.literal)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Value:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.shrink)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.y_scroll)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.object)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    <b>is object of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

templates["tiles.outgoing.named"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.detripler)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.semantic_color)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    <b>Resource:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.object)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n    <b>is object of:</b>\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS),stack1 == null || stack1 === false ? stack1 : stack1.dynamic_text_size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        "
    + escapeExpression(helpers.log.call(depth0, ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate), {hash:{},data:data}))
    + "\n        "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.draft)),stack1 == null || stack1 === false ? stack1 : stack1.triple)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n</div>";
  return buffer;
  });

return templates;

};