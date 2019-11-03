aws s3 rm s3://$2 --recursive
aws s3 cp $1 s3://$2 --recursive --sse AES256