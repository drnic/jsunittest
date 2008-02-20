require 'yaml'

def website_config
  unless @website_config
    begin
      @website_config = YAML.load(File.read(File.expand_path(File.dirname(__FILE__) + "/../config/website.yml")))
    rescue
      puts <<-EOS
To upload your website to a host, you need to configure
config/website.yml. See config/website.yml.sample for 
an example.
EOS
      exit
    end
  end
  @website_config
end

desc 'Generate website files'
task :website_generate => [:ruby_env, :dist, :website_package] do
  (Dir['website/**/*.txt'] - Dir['website/version*.txt']).each do |txt|
    sh %{ #{RUBY_APP} script/txt2html #{txt} > #{txt.gsub(/txt$/,'html')} }
  end
end

task :website_package do
  website_package = "#{APP_NAME}-getting-started"
  website_package_src = "website/dist/#{website_package}"
  FileUtils.mkdir_p "#{website_package_src}/assets", :verbose => true
  FileUtils.copy_file "dist/#{APP_FILE_NAME}",       "website/dist/#{APP_FILE_NAME}"
  FileUtils.copy_file "dist/#{APP_FILE_NAME}",       "website/dist/#{APP_NAME}-#{APP_VERSION}.js"

  FileUtils.copy_file "dist/#{APP_FILE_NAME}",        "#{website_package_src}/assets/#{APP_FILE_NAME}"
  FileUtils.copy_file "test/assets/unittest.css",     "#{website_package_src}/assets/unittest.css"
  FileUtils.copy_file "test/assets/example_test.html","#{website_package_src}/example_test.html"
  chdir(website_package_src) do
    sh %{tar zcvf ../#{website_package}.tar.gz .}
    sh %{zip -r ../#{website_package}-getting-started.zip .}
  end
end

desc 'Upload website files to rubyforge'
task :website_upload do
  host        = website_config["host"] # "#{rubyforge_username}@rubyforge.org"
  remote_dir  = website_config["remote_dir"] # "/var/www/gforge-projects/#{PATH}/"
  local_dir   = 'website'
  sh %{rsync -aCv #{local_dir}/ #{host}:#{remote_dir}}
end

desc 'Generate and upload website files'
task :website => [:website_generate, :website_upload]
