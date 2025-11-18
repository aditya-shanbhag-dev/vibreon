package cloudinary

import (
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
)

func New() (*cloudinary.Cloudinary, error) {
	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	return cld, err
}
