# The Plugin class holds information about a plugin and allows other objects
# to call plugin methods
class Plugin < ActiveRecord::Base
  include PluginLoader
  include Filter
  include Filter::Publisher


  load_plugins('plugins')
  validate :type, :method_name, :class_name, :hook_name, presence: true
  
  serialize :options, Hash
  serialize :features, Array

  def self.by_install_date
    order(:created_at)
  end
  
  def self.by_last_updated
    order(:modified_at)
  end

  def self.for_hook(hook)
    where(hook_name: hook)
  end

  def self.by_priority
    by_install_date.order(:priority)
  end

  def info
    class_name.constantize.info
  end
end
