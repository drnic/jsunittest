set :application, "jsunittest"
set :repository,  "set your repository location here"

# If you aren't deploying to /u/apps/#{application} on the target
# servers (which is the default), you can specify the actual location
# via the :deploy_to variable:
# set :deploy_to, "/var/www/#{application}"

# If you aren't using Subversion to manage your source code, specify
# your SCM below:
# set :scm, :subversion

role :app, "your app-server here"
role :web, "your web-server here"
role :db,  "your db-server here", :primary => true

require "slicehost/recipes/capistrano"
# Used to setup/update DNS registry of url => ip
set :domain_mapping, "jsunittest.com" => "208.78.99.82"
set :slicehost_config, File.dirname(__FILE__) + "/slicehost.yml"
