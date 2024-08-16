.PHONY: dockerbuild dockerpush test testonce ruff black lint isort pre-commit-check requirements-update requirements setup
VERSION ?= latest
IMAGENAME = eodhp-resource-catalogue-ui
DOCKERREPO ?= public.ecr.aws/n1b3o1k2/ukeodhp

# dockerbuild:
# 	DOCKER_BUILDKIT=1 docker build -t ${IMAGENAME}:${VERSION} .
#
# dockerpush: dockerbuild testdocker
# 	docker tag ${IMAGENAME}:${VERSION} ${DOCKERREPO}/${IMAGENAME}:${VERSION}
# 	docker push ${DOCKERREPO}/${IMAGENAME}:${VERSION}

# test:
# 	./venv/bin/ptw configscanning
#
# testonce:
# 	./venv/bin/pytest
