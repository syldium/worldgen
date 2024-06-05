use std::fs::File;
use std::io::{BufReader, Read};
use std::path::Path;

pub fn are_identical(path1: &Path, path2: &Path) -> std::io::Result<bool> {
    let file1 = File::open(path1)?;
    let mut reader1 = BufReader::new(file1);
    let file2 = File::open(path2)?;
    let mut reader2 = BufReader::new(file2);
    let mut buf1 = [0; 1000];
    let mut buf2 = [0; 1000];
    loop {
        let len1 = reader1.read(&mut buf1)?;
        let len2 = reader2.read(&mut buf2)?;
        if len1 != len2 || buf1[..len1] != buf2[..len2] {
            return Ok(false);
        }
        if len1 == 0 {
            break;
        }
    }
    Ok(true)
}
