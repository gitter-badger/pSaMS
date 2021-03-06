class HtmlEditor
  include Haml

  def self.info
    ["Core Editor: HTML v1.0","Adds an HTML editor for posts."]
  end

  def initialize
    logger.info "Initializing CoreEditor::Html"
  end

  def self.migrate ; end

  def self.setup
    Plugin.add_action('add_editor', 'admin.posts', "HtmlEditor", 'get_post_editor',0)
    Plugin.add_action('add_css', 'admin.posts', "HtmlEditor", 'get_css',0)
    Plugin.add_action('add_js', 'admin.posts', "HtmlEditor", 'get_js',0)
    Plugin.add_action('add_editor', 'admin.posts.new', "HtmlEditor", 'get_post_editor',0)
    Plugin.add_action('add_css', 'admin.posts.new', "HtmlEditor", 'get_css',0)
    Plugin.add_action('add_js', 'admin.posts.new', "HtmlEditor", 'get_js',0)
  end

  def get_post_editor(context,form,error)
    { name: 'HTML',
      body: context.partial("core_editor/html/html_editor.haml", locals: {f: form, error: error})
    }
  end

  def get_css
    '<link rel="stylesheet" href="/assets/core_editor/css/html-editor.css"></script>'.html_safe
  end
  def get_js
    '<script type="text/javascript" src="/assets/core_editor/js/jquery.hotkeys.js"></script>' +
    '<script type="text/javascript" src="/assets/core_editor/js/bootstrap-wysiwyg.js"></script>' +
    '<script type="text/javascript" src="/assets/core_editor/js/html-editor.js"></script>'.html_safe
  end
end
