from django.db import models


class BaseModel(models.Model):
    """Abstract base model with created_at and updated_at fields."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Meta options for BaseModel."""

        abstract = True


class TenantAwareModel(BaseModel):
    """Abstract model that adds tenant isolation to models.

    This model implements the multi-tenant pattern using a tenant_id column.
    All tenant-specific models should inherit from this class to ensure proper
    data isolation between tenants.
    """

    tenant_id = models.UUIDField(
        db_index=True,  # Index for better query performance
        help_text="ID do tenant ao qual este registro pertence",
    )

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """Override save to ensure tenant_id is always set.

        Raises ValidationError if tenant_id is not provided.
        """
        if not self.tenant_id:
            from django.core.exceptions import ValidationError

            raise ValidationError(
                "tenant_id é obrigatório para modelos multi-tenant",
            )
        super().save(*args, **kwargs)

    @classmethod
    def get_tenant_objects(cls, tenant_id):
        """Helper method to get all objects for a specific tenant.

        This enforces tenant isolation at the query level.
        """
        return cls.objects.filter(tenant_id=tenant_id)
