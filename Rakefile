require 'html-proofer'

task :test do
  sh "bundle exec jekyll build"
  HTMLProofer.check_directory("./_site", {
    :allow_hash_href => true,
    :alt_ignore => [/.+/],
    :assume_extension => true,
    :check_html => true,
    :disable_external => true,
    :empty_alt_ignore => true,
    :file_ignore => [
      %r{/blog/2015/},
    ],
    :internal_domains => [
      "babeljs.io",
    ],
    :only_4xx => true,
    :url_swap => {
      /#.*$/ => "",
    },
  }).run
end

task :default => :test
