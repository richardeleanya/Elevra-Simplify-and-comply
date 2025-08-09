resource "aws_lb" "main" {
  name               = "${var.project}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [module.vpc.default_security_group_id]
  subnets            = module.vpc.public_subnets
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.blue.arn
  }
}

resource "aws_lb_target_group" "blue" {
  name     = "${var.project}-blue"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

resource "aws_lb_target_group" "green" {
  name     = "${var.project}-green"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "alb_listener_arn" {
  value = aws_lb_listener.http.arn
}

output "alb_blue_target_group_arn" {
  value = aws_lb_target_group.blue.arn
}

output "alb_green_target_group_arn" {
  value = aws_lb_target_group.green.arn
}