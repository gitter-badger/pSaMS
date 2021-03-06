# Helper methods defined here can be accessed in any controller or view in the application

PSaMs::App.helpers do
  #include Sinatra::AssetPack::Helpers
  #include Sprockets::Helpers
  #method to set the theme. returns the layout.

  def set_theme
    puts "Setting theme"
    theme = params[:theme] || 'default'
    theme_path = '/views/layouts/theme/'+theme

    #Padrino::Pipeline.configure_assets do |config|
    #  config.css_assets = [config.css_assets] + [theme_path+'/stylesheets']
    #  config.js_assets = [config.js_assets] + [theme_path+'/javascripts']
    #  config.image_assets = [config.image_assets] + [theme_path+'/images']
    #end
    #layout theme
    return theme_path #theme.to_sym
  end
  def theme_layout_path
    "theme/"+(params[:theme] || 'default')
  end
  def theme_partial_path
    '/layouts/theme/'+(params[:theme] || 'default')
  end
  def theme_asset_path
    'theme/'+(params[:theme] || 'default')
  end

  def js(file, options={})
    javascript_include_tag "/assets/#{file}", (options || {})
  end
  def css(file,options = {})
    stylesheet_link_tag "/assets/#{file}", (options || {})
  end
  def image(file,options={})
    image_tag "/assets/#{file}", (options || {})
  end


  def theme_js(file,options={})
    javascript_include_tag "/assets/#{theme_asset_path}/#{file}", options
  end
  def theme_css(file,options={})
    stylesheet_link_tag "/assets/#{theme_asset_path}/#{file}", options
  end
  def theme_image(file,options={})
    image_tag "/assets/#{theme_asset_path}/#{file}", options
  end

  def category_menu(categories = Category.top_level,options={})
    return "" if categories.blank?
    ret = "<ul class=\"#{options[:class] || 'menu'}\">\n"
    categories.each do |cat|
      ret += "<li>
                #{link_for_category(cat)}
                #{category_menu(cat.children, options.deep_merge({ :class => (options[:submenu_class] || "sub-menu") }) )}
             </li>"
    end
    (ret += "\n</ul>").html_safe
  end

  def load_category(category_id = nil)
    @category = Category.find_by_id(category_id || params[:category_id] || params[:id]) || Category.first
  end

  def link_for_category(category)
    link_to( category.name, (category.link.present? ? category.link : url_for(:posts,:category, id: category.id)) )
  end

  def news_posts_for(category = Category.first, num = 5)
    category = Category.first if category.blank?
    category.posts.for_news.limit(num)
  end

  def render_from_file(path, *opts, &block)
    ret = render_to_string path, opts
    yield ret &block_given?
  end
end
