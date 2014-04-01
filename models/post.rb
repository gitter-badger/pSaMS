class Post < ActiveRecord::Base
  belongs_to :account
  belongs_to :category
  validates_presence_of :title
  validates_presence_of :body
  
  # finds all posts according to category path
  # Examples:
  # <code>
  #   Post.find_by_category("Welcome to MeBlog")
  #   Post.find_by_category("Welcome to MeBlog",:tools)
  #   Post.find_by_category("Welcome to MeBlog","tools")
  # </code>
  def self.find_all_by_category(*path)
    path = path.map(&:to_s)
    cur_category = Category.find_by_name(path[0])
    path[1..-1].each do |s|
      cur_category = Category.find_by_name(s) unless cur_category.nil
    end if path.size > 1
        
    return cur_category.posts
  end
end
