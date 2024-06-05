use std::collections::{BTreeMap, HashSet};
use std::env;
use std::fs::{self, DirEntry};
use std::path::{Path, PathBuf};
use walkdir::WalkDir;
use merger::are_identical;

fn main() {
    let source = env::args()
        .nth(1)
        .expect("The directory source is required");
    let target = env::args()
        .nth(2)
        .expect("The directory target is required");
    let mut versions = fs::read_dir(&source)
        .expect("Existing directory")
        .collect::<Result<Vec<DirEntry>, std::io::Error>>()
        .expect("The source directory should be readable");
    versions
        .sort_by(|a, b| {
            version_compare::compare(
                a.file_name().to_str().unwrap(),
                b.file_name().to_str().unwrap(),
            ).expect("The directory name should be a valid version").ord().unwrap()
        });

    let mut mappings = BTreeMap::<String, BTreeMap<String, String>>::new();
    for (i, version) in versions.iter().enumerate() {
        println!("Processing version {}", version.path().display());
        let mut local_mappings = BTreeMap::<String, String>::new();
        for entry in WalkDir::new(version.path()) {
            let entry = entry.unwrap();
            if entry.file_type().is_dir() {
                continue;
            }
            let mut oldest = entry.path().to_path_buf();
            for older_version in &versions[..i] {
                let file: PathBuf = oldest
                    .strip_prefix(&source)
                    .unwrap()
                    .iter()
                    .skip(1)
                    .collect();
                let file = PathBuf::from(&source)
                    .join(older_version.file_name())
                    .join(file);
                if file.exists() && are_identical(&oldest, &file).unwrap() {
                    oldest = file;
                }
            }
            let mut registry = entry
                .path()
                .strip_prefix(&source)
                .unwrap()
                .strip_prefix(version.file_name())
                .unwrap()
                .to_path_buf();
            registry.set_extension("");
            local_mappings.insert(
                registry
                    .to_str()
                    .unwrap()
                    .to_string(),
                oldest
                    .strip_prefix(&source)
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string(),
            );
        }
        mappings.insert(
            version
                .path()
                .file_name()
                .unwrap()
                .to_str()
                .unwrap()
                .to_string(),
            local_mappings,
        );
    }

    let mut files = HashSet::<String>::new();
    for (version, local_mappings) in mappings {
        println!("'{}': {{\n  tags: {{", version);
        let mut previous_was_tag = true;
        for (file, oldest) in local_mappings {
            if let Some(registry) = file.strip_prefix("tags/") {
                if !previous_was_tag {
                    panic!("The tags should be grouped together");
                }
                println!("    '{registry}': '{oldest}',");
            } else {
                if previous_was_tag {
                    println!("  }},\n  registries: {{");
                    previous_was_tag = false;
                }
                println!("    '{file}': '{oldest}',");
            }
            files.insert(oldest);
        }
        println!("  }}\n}},");
    }

    let target = Path::new(&target);
    if !target.exists() {
        fs::create_dir_all(target).expect("The target directory should be writable");
    }
    for file in files {
        let path = Path::new(&source).join(&file);
        // Copying to the target
        let target = target.join(&file);
        if !target.exists() {
            fs::create_dir_all(target.parent().unwrap()).expect("The target directory should be writable");
            fs::copy(&path, &target).expect("The target directory should be writable");
        }
    }
}
