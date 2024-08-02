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

# lint:
#     npm run lint

venv:
	virtualenv -p python3.11 venv
	./venv/bin/python -m ensurepip -U
	./venv/bin/pip3 install pip-tools
	./venv/bin/pip3 install pre-commit

.git/hooks/pre-commit:
	curl -o .pre-commit-config.yaml https://raw.githubusercontent.com/EO-DataHub/github-actions/main/.pre-commit-config-node.yaml
	curl -o .eslintrc.cjs https://raw.githubusercontent.com/EO-DataHub/github-actions/main/.eslintrc.cjs

setup: venv .git/hooks/pre-commit