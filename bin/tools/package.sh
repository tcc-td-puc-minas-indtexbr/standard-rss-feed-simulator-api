program="Package"
program_flag="${program}:"
project_name='deployment'

# variables
current_dir=$(pwd)
tmp_folder="/tmp/${project_name:?}"
dist_folder="${current_dir:?}/dist"

echo "${program_flag} Current project: ${project_name:?}"
echo "${program_flag} Current dir: ${current_dir:?}"
echo "${program_flag} Temporary folder: ${tmp_folder:?}"

# cria um diretorio temporario
if test ! -d $tmp_folder; then
  echo "${program_flag} Creating the tmp folder"
  mkdir $tmp_folder
else
  echo "${program_flag} The tmp folder already exists"
fi

# cria o dist
if test ! -d $dist_folder; then
  echo "${program_flag} Creating the dist folder"
  mkdir $dist_folder
else
  echo "${program_flag} The dist folder already exists"
fi

# Remove old tmp files
echo "${program_flag} Removing old tmp files"
if test -d $tmp_folder; then
  rm -Rf ${tmp_folder:?}/*
fi

# Remove old dists
echo "${program_flag} Removing the old dists from ${dist_folder:?}/*"
if test -d $tmp_folder; then
  rm -Rf ${dist_folder:?}/*
fi

echo "${program_flag} Changing dir to tmp dir: ./target"
cd ./target

# copy the project content
echo "${program_flag} Copying the project content"
cp -Rf ./ ${tmp_folder:?}/

## remove unnecessary files
rm -Rf "${tmp_folder:?}/venv"
rm -Rf "${tmp_folder:?}/.git"
rm -Rf "${tmp_folder:?}/.chalice"
rm -Rf "${tmp_folder:?}/.devops"
rm -Rf "${tmp_folder:?}/.idea"
rm -Rf "${tmp_folder:?}/-"
rm -Rf "${tmp_folder:?}/target"
rm -Rf "${tmp_folder:?}/dist"
rm -Rf "${tmp_folder:?}/bin"

echo "${program_flag} Changing dir to tmp dir: ${tmp_folder}"
cd ${tmp_folder} || exit

echo "${program_flag} Zipping files in ../${project_name:?}.zip"
python3 ${current_dir:?}/bin/tools/python/zip.py --zip_file=../${project_name:?}.zip --source_dir=.

# move file to the parent directory
echo "${program_flag} Moving file (../${project_name:?}.zip) to the dist directory (${dist_folder:?}/${project_name:?}.zip)"
mv ../${project_name:?}.zip ${dist_folder:?}/${project_name:?}.zip


if test ! -f ${dist_folder:?}/${project_name:?}.zip; then
  echo "${program_flag} Error, zip file not created"
else
  echo "${program_flag} Zip file created with success"
  echo "${program_flag} Listing contents of the dist directory:"
  ls -al $dist_folder
fi

echo "${program_flag} Exiting"