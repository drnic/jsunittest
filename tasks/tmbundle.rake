namespace :bundle do
  bundle_git_repo = "git://github.com/drnic/javascript-unittest-tmbundle.git"
  bundle_dir = "website/tmbundle"
  bundle_name = 'JavaScript\ Unit\ Testing.tmbundle'
  bundle_clone_dir = "#{bundle_dir}/#{bundle_name}"
  desc "Import TM bundle into website/ and compress"
  task :import => [:setup, :fetch, :compress]

  task :setup do
    FileUtils.mkdir_p bundle_dir
  end

  task :fetch do
    puts cmd = "git clone #{bundle_git_repo} #{bundle_clone_dir}"
    `#{cmd}`
  end
  
  task :compress do
    chdir(bundle_dir) do
      sh %{tar zcvf #{bundle_name}.tar.gz #{bundle_name} }
    end    
    `rm -rf #{bundle_clone_dir}`
  end
end