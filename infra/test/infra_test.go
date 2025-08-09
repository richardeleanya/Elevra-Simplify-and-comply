package test

import (
	"testing"
	"os"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestInfraBasic(t *testing.T) {
	terraformOptions := &terraform.Options{
		TerraformDir: "../",
		Vars: map[string]interface{}{
			"db_password": os.Getenv("TF_VAR_db_password"),
		},
	}

	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)

	vpcID := terraform.Output(t, terraformOptions, "vpc_id")
	assert.NotEmpty(t, vpcID)
	eksCluster := terraform.Output(t, terraformOptions, "eks_cluster_name")
	assert.NotEmpty(t, eksCluster)
	rdsEndpoint := terraform.Output(t, terraformOptions, "rds_endpoint")
	assert.Contains(t, rdsEndpoint, "rds.amazonaws.com")
}